import { Cuisine, PRICE, Location, Review } from "@prisma/client";
import Link from "next/link";
import Price from "../../components/Price";
import calculateReviewsRatingAverage from "../../../utils/calculateReviewsRatingAverage";
import Stars from "../../components/Stars";

interface Restaurant {
  id: number;
  name: string;
  main_image: string;
  location: Location;
  cuisine: Cuisine;
  price: PRICE;
  slug: string;
  reviews: Review[];
}

interface Props {
  restaurant: Restaurant;
}

export default function RestaurantCard({
  restaurant: { id, name, main_image, location, cuisine, price, slug, reviews },
}: Props) {
  const rating = calculateReviewsRatingAverage(reviews);
  const renderRatingText = () => {
    if (rating > 4) return "Awesome";
    if (rating > 3) return "Good";
    if (rating > 0) return "Average";
    return "";
  };

  return (
    <div className="border-b flex pb-5 ml-4">
      <img src={main_image} alt={name} className="w-44 rounded object-cover" />
      <div className="pl-5">
        <h2 className="text-3xl">{name}</h2>
        <div className="flex items-start">
          <div className="flex mb-2">
            <Stars rating={rating} />
          </div>
          <p className="ml-2 text-sm">{renderRatingText()}</p>
        </div>
        <div className="mb-9">
          <div className="flex text-reg">
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
