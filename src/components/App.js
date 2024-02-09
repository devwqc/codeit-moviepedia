import { useEffect, useState } from 'react';
import ReviewList from './ReviewList';
import {
  createReviews,
  deleteReviews,
  getReviews,
  updateReviews,
} from '../api';
import ReviewForm from './ReviewForm';

const LIMIT = 6;

function App() {
  const [items, setItems] = useState([]);
  const [order, setOrder] = useState('createdAt');
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingError, setLoadingError] = useState(null);
  const sortedItems = items.sort((a, b) => b[order] - a[order]);

  const handleNewestClick = () => setOrder('createdAt');
  const handleBestClick = () => setOrder('rating');

  const handleDelete = async (id) => {
    const result = await deleteReviews(id);
    if (!result) return;
    setItems((preItems) => preItems.filter((item) => item.id !== id));
  };

  const handleLoad = async (options) => {
    let result;
    try {
      setIsLoading(true);
      setLoadingError(null);
      result = await getReviews(options);
    } catch (error) {
      setLoadingError(error);
      return;
    } finally {
      setIsLoading(false);
    }
    const { reviews } = result;
    if (options.offset === 0) {
      setItems(reviews);
    } else {
      setItems((preItems) => [...preItems, ...reviews]);
    }
    setOffset(options.offset + reviews.length);
  };

  const handleLoadMore = () => {
    handleLoad({ order, offset, limit: LIMIT });
  };

  const handleCreateSuccess = (review) => {
    setItems((preItems) => [review, ...preItems]);
  };

  const handleUpdateSuccess = (review) => {
    setItems((preItems) => {
      const splitIdx = preItems.findIndex((item) => item.id === review.id);
      return [
        ...preItems.slice(0, splitIdx),
        review,
        ...preItems.slice(splitIdx + 1),
      ];
    });
  };

  useEffect(() => {
    handleLoad({ order, offset: 0, limit: LIMIT });
  }, [order]);

  return (
    <div>
      <div>
        <button onClick={handleNewestClick}>최신순</button>
        <button onClick={handleBestClick}>베스트순</button>
      </div>
      <ReviewForm
        onSubmit={createReviews}
        onSubmitSuccess={handleCreateSuccess}
      />
      <ReviewList
        items={sortedItems}
        onDelete={handleDelete}
        onUpdate={updateReviews}
        onUpdateSuccess={handleUpdateSuccess}
      />
      <button disabled={isLoading} onClick={handleLoadMore}>
        더보기
      </button>
      {loadingError?.message && <span>{loadingError.message}</span>}
    </div>
  );
}

export default App;
