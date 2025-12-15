import { ProductDataMapper } from '../../mappers/product.mapper';
import { ProductDataAccessMapper } from '../../../infrastructure/mappers/product.mapper';

export const MapperProviders = [ProductDataMapper, ProductDataAccessMapper];
