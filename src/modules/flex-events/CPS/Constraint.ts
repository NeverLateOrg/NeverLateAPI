export abstract class Constraint<T> {
  public variables: string[];
  constructor(variables: string[]) {
    this.variables = variables;
  }
  abstract isSatisfied(assignment: Record<string, T>): boolean;
}
