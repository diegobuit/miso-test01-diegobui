export class Repositorio {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public language: string,
    public stars: number,
    public createdAt: string,
    public ownerId: number
  ) {}
}
