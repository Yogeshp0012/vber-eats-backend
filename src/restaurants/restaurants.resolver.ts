import { Mutation, Query, Resolver } from "@nestjs/graphql";
import { Restaurant } from "./entities/restaurant.entity";
import { RestaurantService } from "./services/restaurant.service";

@Resolver()
export class RestaurantResolver{
    constructor(private readonly restaurantService: RestaurantService){}
    @Query(() => [Restaurant])
    getRestaurant():  Promise<Restaurant[]> {
        return this.restaurantService.getAll();
    }

    @Mutation(() => Restaurant)
    async createRestaurant():  Promise<Restaurant> {
        try{
            return this.restaurantService.createRestaurant();
        }
        catch(e){
            console.log(e);
        }
    }
}
