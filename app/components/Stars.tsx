import fullStar from "../../public/full-star.png";
import halfStar from "../../public/half-star.png";
import emptyStar from "../../public/empty-star.png";
import Image from "next/image";
import { Review } from "@prisma/client";
import calculateReviewsRatingAverage from "../../utils/calculateReviewsRatingAverage";

export default function Stars({
  reviews = [],
  rating,
}: {
  reviews?: Review[];
  rating?: number;
}) {
  const r = rating || calculateReviewsRatingAverage(reviews);
  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      const difference = r - i;
      if (difference >= 1) {
        stars.push(fullStar);
      } else if (difference > 0.2) {
        stars.push(halfStar);
      } else {
        stars.push(emptyStar);
      }
    }
    return stars.map((star) => (
      <Image src={star} alt="" className="w-4 h-4 mr-1" />
    ));
  };
  return <div className="flex items-center">{renderStars()}</div>;
}
