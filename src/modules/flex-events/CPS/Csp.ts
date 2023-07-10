import { type Constraint } from './Constraint';

export class CSP<V> {
  private readonly variables: string[] = [];
  private readonly domains: Record<string, V[]> = {};
  private readonly constraints: Record<string, Array<Constraint<V>>> = {};

  withVariable(variable: string, domain: V[]): this {
    if (this.variables.includes(variable)) {
      throw new Error(`Variable ${variable} already in CSP`);
    } else {
      this.variables.push(variable);
      this.domains[variable] = domain;
    }
    return this;
  }

  withConstraint(constraint: Constraint<V>): this {
    for (const variable of constraint.variables) {
      if (!this.variables.includes(variable)) {
        throw new Error(`Variable ${variable} in constraint not in CSP`);
      } else {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (!this.constraints[variable]) {
          this.constraints[variable] = [];
        }
        this.constraints[variable].push(constraint);
      }
    }
    return this;
  }

  private isConsistent(variable: string, assignment: Record<string, V>): boolean {
    for (const constraint of this.constraints[variable]) {
      if (!constraint.isSatisfied(assignment)) {
        return false;
      }
    }
    return true;
  }

  private backtrack(assignment: Record<string, V>): Record<string, V> | null {
    if (Object.keys(assignment).length === this.variables.length) {
      return assignment;
    }
    const unassigned = this.variables.filter((v) => !(v in assignment));
    const first = unassigned[0];
    for (const value of this.domains[first]) {
      const localAssignment = { ...assignment };
      localAssignment[first] = value;
      if (this.isConsistent(first, localAssignment)) {
        const result = this.backtrack(localAssignment);
        if (result !== null) {
          return result;
        }
      }
    }
    return null;
  }

  solve(): Record<string, V> | null {
    return this.backtrack({});
  }
}
