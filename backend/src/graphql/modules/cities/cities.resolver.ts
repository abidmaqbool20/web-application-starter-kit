import { Resolver, Query, Mutation, Args, ID, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CitiesService } from '../../../modules/cities/cities.service';
import { CityType } from './city.type';
import { CreateCityInput, UpdateCityInput } from './city.input';
import { GqlAuthGuard } from '../common/gql-auth.guard';

@Resolver(() => CityType)
@UseGuards(GqlAuthGuard)
export class CitiesResolver {
    constructor(private readonly citiesService: CitiesService) { }

    @Query(() => [CityType], { name: 'cities' })
    async findAll(
        @Args('stateId', { type: () => Int, nullable: true }) stateId?: number,
        @Args('countryId', { type: () => Int, nullable: true }) countryId?: number,
    ): Promise<any[]> {
        if (stateId) {
            return this.citiesService.findByState(stateId);
        }
        if (countryId) {
            return this.citiesService.findByCountry(countryId);
        }
        return this.citiesService.findAll();
    }

    @Query(() => CityType, { name: 'city', nullable: true })
    async findOne(@Args('id', { type: () => Int }) id: number): Promise<CityType | null> {
        return this.citiesService.findOne(id);
    }

    @Mutation(() => CityType)
    async createCity(@Args('input') input: CreateCityInput): Promise<CityType> {
        return this.citiesService.create({
            name: input.name,
            countryId: input.countryId,
            stateId: input.stateId,
            isActive: input.isActive,
        });
    }

    @Mutation(() => CityType)
    async updateCity(
        @Args('id', { type: () => Int }) id: number,
        @Args('input') input: UpdateCityInput,
    ): Promise<CityType> {
        return this.citiesService.update(id, {
            name: input.name,
            countryId: input.countryId,
            stateId: input.stateId,
            isActive: input.isActive,
        });
    }

    @Mutation(() => Boolean)
    async deleteCity(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
        await this.citiesService.remove(id);
        return true;
    }
}
