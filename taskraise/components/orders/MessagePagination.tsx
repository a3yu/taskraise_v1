export function Pagination({
  messagesPerPage,
  totalMessages,
  paginate,
}: {
  messagesPerPage: number;
  totalMessages: number;
  paginate: (number: number) => void;
}) {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalMessages / messagesPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="flex justify-center space-x-2">
        {pageNumbers.map((number) => (
          <li key={number}>
            <button
              onClick={() => paginate(number)}
              className="px-3 py-1 border rounded hover:bg-gray-200"
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
