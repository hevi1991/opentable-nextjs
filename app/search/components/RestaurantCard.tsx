import { Cuisine, PRICE, Location } from "@prisma/client";
import Link from "next/link";
import Price from "../../components/Price";

interface Restaurant {
  id: number;
  name: string;
  main_image: string;
  location: Location;
  cuisine: Cuisine;
  price: PRICE;
  slug: string;
}

interface Props {
  restaurant: Restaurant;
}

export default function RestaurantCard({
  restaurant: { id, name, main_image, location, cuisine, price, slug },
}: Props) {
  return (
    <div className="border-b flex pb-5 ml-4">
      <img src={main_image} alt={name} className="w-44 rounded object-cover" />
      <div className="pl-5">
        <h2 className="text-3xl">{name}</h2>
        <div className="flex items-start">
          <div className="flex mb-2">*****</div>
          <p className="ml-2 text-sm">Awesome</p>
        </div>
        <div className="mb-9">
          <div className="font-light flex text-reg">
            <Price price={price} />
            <p className="mr-4 capitalize">{cuisine.name}</p>
            <p className="mr-4 capitalize">{location.name}</p>
          </div>
        </div>
        <div className="text-red-600">
          <Link href={`/restaurant/${slug}`}>View more information</Link>
        </div>
      </div>
    </div>
  );
}
