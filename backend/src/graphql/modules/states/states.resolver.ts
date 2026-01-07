import { Resolver, Query, Mutation, Args, ID, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { StatesService } from '../../../modules/states/states.service';
import { StateType } from './state.type';
import { CreateStateInput, UpdateStateInput } from './state.input';
import { GqlAuthGuard } from '../common/gql-auth.guard';

@Resolver(() => StateType)
@UseGuards(GqlAuthGuard)
export class StatesResolver {
    constructor(private readonly statesService: StatesService) { }

    @Query(() => [StateType], { name: 'states' })
    async findAll(
        @Args('countryId', { type: () => Int, nullable: true }) countryId?: number,
    ): Promise<StateType[]> {
        if (countryId) {
            return this.statesService.findByCountry(countryId);
        }
        return this.statesService.findAll();
    }

    @Query(() => StateType, { name: 'state', nullable: true })
    async findOne(@Args('id', { type: () => Int }) id: number): Promise<StateType | null> {
        return this.statesService.findOne(id);
    }

    @Mutation(() => StateType)
    async createState(@Args('input') input: CreateStateInput): Promise<StateType> {
        return this.statesService.create({
            name: input.name,
            countryId: input.countryId,
            isActive: input.isActive,
        });
    }

    @Mutation(() => StateType)
    async updateState(
        @Args('id', { type: () => Int }) id: number,
        @Args('input') input: UpdateStateInput,
    ): Promise<StateType> {
        return this.statesService.update(id, {
            name: input.name,
            countryId: input.countryId,
            isActive: input.isActive,
        });
    }

    @Mutation(() => Boolean)
    async deleteState(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
        await this.statesService.remove(id);
        return true;
    }
}
