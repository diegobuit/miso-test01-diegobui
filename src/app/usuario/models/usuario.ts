export class Usuario {
  constructor(
    public id: number,
    public username: string,
    public name: string,
    public email: string,
    public avatarUrl: string,
    public role: string,
    public location: string,
    public repoIds: number[]
  ) {}
}
