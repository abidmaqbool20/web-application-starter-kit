import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { MasterDataService } from '../../../modules/master_data/master_data.service';
import { MasterDataType } from './master-data.type';
import { CreateMasterDataInput, UpdateMasterDataInput } from './master-data.input';
import { GqlAuthGuard } from '../common/gql-auth.guard';

@Resolver(() => MasterDataType)
export class MasterDataResolver {
    constructor(private readonly masterDataService: MasterDataService) { }

    @Query(() => [MasterDataType], { name: 'masterDataList', description: 'Get all master data entries' })
    @UseGuards(GqlAuthGuard)
    async findAll(): Promise<MasterDataType[]> {
        return this.masterDataService.findAll();
    }

    @Query(() => MasterDataType, { name: 'masterData', nullable: true, description: 'Get a single master data entry by ID' })
    @UseGuards(GqlAuthGuard)
    async findOne(@Args('id', { type: () => ID }) id: string): Promise<MasterDataType | null> {
        return this.masterDataService.findOne(id);
    }

    @Query(() => [MasterDataType], { name: 'masterDataByCategory', description: 'Get all master data entries for a category (e.g., employment_type, religion)' })
    async findByCategory(
        @Args('category') category: string,
        @Args('activeOnly', { nullable: true, defaultValue: true }) activeOnly: boolean,
    ): Promise<MasterDataType[]> {
        return this.masterDataService.findByCategory(category, activeOnly);
    }

    @Query(() => [MasterDataType], { name: 'masterDataByParent', description: 'Get child entries for a parent (e.g., castes under a religion)' })
    async findByParent(
        @Args('parentId', { type: () => ID }) parentId: string,
        @Args('activeOnly', { nullable: true, defaultValue: true }) activeOnly: boolean,
    ): Promise<MasterDataType[]> {
        return this.masterDataService.findByParent(parentId, activeOnly);
    }

    @Query(() => [MasterDataType], { name: 'masterDataRootItems', description: 'Get root items for a category (items with no parent)' })
    async findRootItems(
        @Args('category') category: string,
        @Args('activeOnly', { nullable: true, defaultValue: true }) activeOnly: boolean,
    ): Promise<MasterDataType[]> {
        return this.masterDataService.findRootItems(category, activeOnly);
    }

    @Mutation(() => MasterDataType, { description: 'Create a new master data entry' })
    @UseGuards(GqlAuthGuard)
    async createMasterData(@Args('input') input: CreateMasterDataInput): Promise<MasterDataType> {
        return this.masterDataService.create(input);
    }

    @Mutation(() => MasterDataType, { description: 'Update an existing master data entry' })
    @UseGuards(GqlAuthGuard)
    async updateMasterData(
        @Args('id', { type: () => ID }) id: string,
        @Args('input') input: UpdateMasterDataInput,
    ): Promise<MasterDataType> {
        return this.masterDataService.update(id, input);
    }

    @Mutation(() => Boolean, { description: 'Delete a master data entry' })
    @UseGuards(GqlAuthGuard)
    async deleteMasterData(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
        await this.masterDataService.remove(id);
        return true;
    }

    @Mutation(() => [MasterDataType], { description: 'Bulk create master data entries' })
    @UseGuards(GqlAuthGuard)
    async bulkCreateMasterData(
        @Args('inputs', { type: () => [CreateMasterDataInput] }) inputs: CreateMasterDataInput[],
    ): Promise<MasterDataType[]> {
        return this.masterDataService.bulkCreate(inputs);
    }
}
