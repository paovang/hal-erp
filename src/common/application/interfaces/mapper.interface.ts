export interface IMapper<Domain, DTO> {
  toDomain(raw: DTO): Domain;
  toDTO(entity: Domain): DTO;
}
