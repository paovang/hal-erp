import { IMapper } from '../interfaces/mapper.interface';

export abstract class BaseMapper<D, DTO> implements IMapper<D, DTO> {
  abstract toDomain(dto: DTO): D;
  abstract toDTO(entity: D): DTO;
}
