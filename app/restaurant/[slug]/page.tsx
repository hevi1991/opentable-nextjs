import { PrismaClient, Review } from "@prisma/client";
import Description from "./components/Description";
import Images from "./components/Images";
import Rating from "./components/Rating";
import ReservationCard from "./components/ReservationCard";
import RestaurantNavBar from "./components/RestaurantNavBar";
import Reviews from "./components/Reviews";
import Title from "./components/Title";
import { notFound } from "next/navigation";

const prisma = new PrismaClient();

interface Restaurant {
  id: number;
  name: string;
  description: string;
  slug: string;
  images: string[];
  reviews: Review[];
}

const fetchRestaurantBySlug = async (slug: string): Promise<Restaurant> => {
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      description: true,
      slug: true,
      images: true,
      reviews: true,
    },
  });

  if (!restaurant) {
    // notFound 会帮你throw一个nextjs的404错误
    notFound();
  }

  return restaurant;
};

export default async function RestaurantDetails({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const restaurant = await fetchRestaurantBySlug(slug);

  return (
    <>
      <div className="bg-white w-[70%] rounded p-3 shadow">
        <RestaurantNavBar slug={restaurant.slug} />
        <Title title={restaurant.name} />
        <Rating reviews={restaurant.reviews} />
        <Description description={restaurant.description} />
        <Images images={restaurant.images} />
        <Reviews reviews={restaurant.reviews} />
      </div>
      <div className="w-[27%] relative text-reg">
        <ReservationCard />
      </div>
    </>
  );
}
