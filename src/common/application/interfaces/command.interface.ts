export interface ICommand<Input, Output> {
  execute(input: Input): Promise<Output>;
}

export interface IQuery<Input, Output> {
  execute(input: Input): Promise<Output>;
}

// export class UserMapper extends BaseMapper<User, UserDto> {
//   toDomain(dto: UserDto): User {
//     return new User(dto.id, dto.email, new Date(dto.createdAt));
//   }

//   toDTO(entity: User): UserDto {
//     return {
//       id: entity.id,
//       email: entity.email,
//       createdAt: this.toISODate(entity.createdAt)
//     };
//   }
// }
