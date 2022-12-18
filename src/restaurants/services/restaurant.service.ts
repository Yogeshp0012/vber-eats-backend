import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Restaurant } from "../entities/restaurant.entity";

@Injectable()
export class RestaurantService {
    constructor(@InjectRepository(Restaurant) private readonly restaurantRepo: Repository<Restaurant>) { }
    getAll(): Promise<Restaurant[]> {
        return this.restaurantRepo.find();
    }

    createRestaurant(): Promise<Restaurant> {
        const newRestaurant = this.restaurantRepo.create({id: "1", isGood: true, name: "test"});
        return this.restaurantRepo.save(newRestaurant);
    }
}
