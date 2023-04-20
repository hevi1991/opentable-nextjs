import RestaurantCard from "./components/RestaurantCard";
import Header from "./components/Header";
import SearchSideBar from "./components/SearchSideBar";
import { PRICE, PrismaClient } from "@prisma/client";

export interface SearchParams {
  city?: string;
  cuisine?: string;
  price?: PRICE;
}

const prisma = new PrismaClient();

const fetchRestaurantsByCity = (city: string | undefined) => {
  const select = {
    id: true,
    name: true,
    main_image: true,
    cuisine: true,
    location: true,
    price: true,
    slug: true,
  };

  if (!city) {
    return prisma.restaurant.findMany({ select });
  }

  const restaurants = prisma.restaurant.findMany({
    where: {
      location: {
        name: {
          contains: city.toLowerCase(),
        },
      },
    },
    select,
  });
  return restaurants;
};

const fetchLocations = async () => {
  return prisma.location.findMany();
};

const fetchCuisine = async () => {
  return prisma.cuisine.findMany();
};

export default async function Search({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const restaurants = await fetchRestaurantsByCity(searchParams.city);
  const locations = await fetchLocations();
  const cuisines = await fetchCuisine();

  return (
    <>
      <Header />
      <div className="flex py-4 m-auto w-2/3 justify-between items-start">
        <SearchSideBar
          locations={locations}
          cuisines={cuisines}
          searchParams={searchParams}
        />
        <div className="w-5/6">
          {restaurants.length ? (
            restaurants.map((restaurant) => (
              <RestaurantCard restaurant={restaurant} key={restaurant.id} />
            ))
          ) : (
            <p>Sorry, we found no restaurants in this area.</p>
          )}
        </div>
      </div>
    </>
  );
}
