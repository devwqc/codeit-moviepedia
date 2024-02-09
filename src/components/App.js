import { useEffect, useState } from 'react';
import ReviewList from './ReviewList';
import {
  createReviews,
  deleteReviews,
  getReviews,
  updateReviews,
} from '../api';
import ReviewForm from './ReviewForm';
import useAsync from './hooks/useAsync';

const LIMIT = 6;

function App() {
  const [items, setItems] = useState([]);
  const [order, setOrder] = useState('createdAt');
  const [offset, setOffset] = useState(0);
  const [isLoading, loadingError, getReviesAsync] = useAsync(getReviews);
  const sortedItems = items.sort((a, b) => b[order] - a[order]);

  const handleNewestClick = () => setOrder('createdAt');
  const handleBestClick = () => setOrder('rating');

  const handleDelete = async (id) => {
    const result = await deleteReviews(id);
    if (!result) return;
    setItems((preItems) => preItems.filter((item) => item.id !== id));
  };

  const handleLoad = async (options) => {
    const result = await getReviesAsync(options);
    if (!result) return;
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
      {loadingError?.message && <div>{loadingError.message}</div>}
    </div>
  );
}

export default App;
