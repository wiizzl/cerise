export interface RepoFile {
  name: string;
  sha: string;
}

export class ConflictError extends Error {
  constructor() {
    super("La boucle a changé dans le dépôt. Actualise et réessaie.");
  }
}

interface Request {
  method?: string;
  body?: unknown;
  raw?: boolean;
  fresh?: boolean;
}

const AUTHOR = { name: "Cerise", email: "cerise@cerise.invalid" };

const MESSAGES: Record<number, string> = {
  401: "Token invalide ou expiré. Mets-le à jour dans les paramètres.",
  403: "Le token n'a pas le droit d'écrire dans ce dépôt (Contents : lecture et écriture).",
  404: "Dépôt introuvable, ou le token n'y a pas accès.",
};

export class Repo {
  static readonly createUrl =
    "https://github.com/new?name=cerise&visibility=private";

  static readonly tokenUrl =
    `https://github.com/settings/personal-access-tokens/new?${new URLSearchParams(
      {
        name: "Cerise",
        contents: "write",
        expires_in: "365",
      },
    )}`;

  private readonly name: string;
  private readonly token: string;

  constructor(name: string, token: string) {
    this.name = name;
    this.token = token;
  }

  async check() {
    const response = await this.request("");
    if (!response) {
      throw new Error(MESSAGES[404]);
    }

    const repo = (await response.json()) as {
      permissions?: { push?: boolean };
    };
    if (!repo.permissions?.push) {
      throw new Error(MESSAGES[403]);
    }
  }

  async list(): Promise<RepoFile[]> {
    const response = await this.request("/contents/loops");
    const files = ((await response?.json()) ?? []) as RepoFile[];

    return files
      .map(({ name, sha }) => ({ name, sha }))
      .sort((a, b) => b.name.localeCompare(a.name, "fr", { numeric: true }));
  }

  async read(file: RepoFile): Promise<Blob> {
    const response = await this.request(this.path(file.name), { raw: true });
    if (!response) {
      throw new Error("Ce fichier n'est plus dans le dépôt.");
    }

    return response.blob();
  }

  async write(
    name: string,
    content: Blob,
    options: { sha?: string; message: string; overwrite?: boolean },
  ): Promise<RepoFile> {
    let sha = options.sha;

    if (options.overwrite) {
      const current = await this.request(this.path(name), { fresh: true });
      sha = ((await current?.json()) as RepoFile | undefined)?.sha;
    }

    const response = await this.request(this.path(name), {
      method: "PUT",
      body: {
        message: options.message,
        content: new Uint8Array(await content.arrayBuffer()).toBase64(),
        sha,
        author: AUTHOR,
        committer: AUTHOR,
      },
    });
    if (!response) {
      throw new Error(MESSAGES[404]);
    }

    const { content: written } = (await response.json()) as {
      content: RepoFile;
    };

    return { name, sha: written.sha };
  }

  async delete(file: RepoFile, message: string) {
    await this.request(this.path(file.name), {
      method: "DELETE",
      body: { message, sha: file.sha, author: AUTHOR, committer: AUTHOR },
    });
  }

  private path(name: string) {
    return `/contents/loops/${name}`;
  }

  private async request(path: string, request: Request = {}) {
    const response = await fetch(
      `https://api.github.com/repos/${this.name}${path}`,
      {
        method: request.method,
        cache: request.fresh ? "no-store" : "default",
        headers: {
          Accept: request.raw
            ? "application/vnd.github.raw+json"
            : "application/vnd.github+json",
          Authorization: `Bearer ${this.token}`,
          "X-GitHub-Api-Version": "2026-03-10",
          "Content-Type": "application/json",
        },
        body:
          request.body === undefined ? undefined : JSON.stringify(request.body),
      },
    ).catch(() => {
      throw new Error("Dépôt injoignable. Vérifie ta connexion.");
    });

    if (response.status === 404) {
      return undefined;
    }

    if (response.status === 409 || response.status === 422) {
      throw new ConflictError();
    }

    if (!response.ok) {
      throw new Error(
        MESSAGES[response.status] ?? `Erreur du dépôt (${response.status}).`,
      );
    }

    return response;
  }
}
