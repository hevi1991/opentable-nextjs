import { Review } from "@prisma/client";

export default function calculateReviewsRatingAverage(reviews: Review[]) {
  if (reviews.length === 0) return 0;
  
  return (
    reviews.reduce((a, c) => {
      return a + c.rating;
    }, 0) / reviews.length
  );
}
