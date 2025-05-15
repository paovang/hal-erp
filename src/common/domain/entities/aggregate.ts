import { Entity } from './entity';

/**
 * An abstract class that represents the root of an aggregate.
 * Aggregates are clusters of domain entities and value objects
 * that are treated as a single unit for the purpose of data changes.
 *
 * @extends Entity<ID> - Inherits from BaseEntity, ensuring that
 * aggregate roots have an identity and can include additional base functionality.
 *
 * @template ID - The type of the identifier that uniquely identifies instances
 * of the aggregate root.
 */
export abstract class Aggregate<ID> extends Entity<ID> {}
