import { Resolver, Query, Mutation, Args, ID, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CountriesService } from '../../../modules/countries/countries.service';
import { CountryType } from './country.type';
import { CreateCountryInput, UpdateCountryInput } from './country.input';
import { GqlAuthGuard } from '../common/gql-auth.guard';

@Resolver(() => CountryType)
@UseGuards(GqlAuthGuard)
export class CountriesResolver {
    constructor(private readonly countriesService: CountriesService) { }

    @Query(() => [CountryType], { name: 'countries' })
    async findAll(): Promise<CountryType[]> {
        return this.countriesService.findAll();
    }

    @Query(() => CountryType, { name: 'country', nullable: true })
    async findOne(@Args('id', { type: () => Int }) id: number): Promise<CountryType | null> {
        return this.countriesService.findOne(id);
    }

    @Mutation(() => CountryType)
    async createCountry(@Args('input') input: CreateCountryInput): Promise<CountryType> {
        return this.countriesService.create({
            name: input.name,
            isoCode: input.isoCode,
            isActive: input.isActive,
        });
    }

    @Mutation(() => CountryType)
    async updateCountry(
        @Args('id', { type: () => Int }) id: number,
        @Args('input') input: UpdateCountryInput,
    ): Promise<CountryType> {
        return this.countriesService.update(id, {
            name: input.name,
            isoCode: input.isoCode,
            isActive: input.isActive,
        });
    }

    @Mutation(() => Boolean)
    async deleteCountry(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
        await this.countriesService.remove(id);
        return true;
    }
}
