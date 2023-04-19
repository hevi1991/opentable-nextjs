import { Cuisine, Location, PRICE } from "@prisma/client";
import Link from "next/link";
import Price from "./Price";

export interface RestaurantType {
  id: number;
  name: string;
  main_image: string;
  location: Location;
  cuisine: Cuisine;
  price: PRICE;
  slug: string;
}

interface Props {
  restaurant: RestaurantType;
}

export default function RestaurantCard({
  restaurant: { id, name, main_image, location, cuisine, price, slug },
}: Props) {
  return (
    <div className="w-64 h-72 m-3 rounded overflow-hidden border cursor-pointer">
      <Link
        href={`/restaurant/${slug}`}
        className="font-bold text-gray-700 text-2xl"
      >
        <img src={main_image} alt="" className="w-full h-36" />
        <div className="p-1">
          <h3 className="font-bold text-2xl mb-2">{name}</h3>
          <div className="flex items-start">
            <div className="flex mb-2">*****</div>
            <p className="ml-2">77 reviews</p>
          </div>
          <div className="flex text-reg font-light capitalize">
            <p className=" mr-3">{location.name}</p>
            <Price price={price} />
            <p>{cuisine.name}</p>
          </div>
          <p className="text-sm mt-1 font-bold">Booked 3 times today</p>
        </div>
      </Link>
    </div>
  );
}
