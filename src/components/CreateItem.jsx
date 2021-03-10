import React from "react";
import * as db from "../firestore";
import Error from "./shared/Error";

function CreateItem({ user, listId }) {
  const [name, setName] = React.useState("");
  const [link, setLink] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");

  async function handleCreateItem(evt) {
    try {
      evt.preventDefault();
      setSubmitting(true);
      const item = { name, link };
      await db.createListItem({ user, listId, item });
      setName("");
      setLink("");
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <form
        onSubmit={handleCreateItem}
        className="flex lg:w-2/3 w-full sm:flex-row flex-col mx-auto px-8 sm:px-0"
      >
        <input
          className="flex-grow w-full bg-gray-800 rounded border border-gray-700 text-white focus:outline-none focus:border-green-500 text-base px-4 py-2 mr-4 mb-4 sm:mb-0"
          name="name"
          placeholder="Add item name"
          type="text"
          onChange={(evt) => setName(evt.target.value)}
          value={name}
        />
        <input
          className="flex-grow w-full bg-gray-800 rounded border border-gray-700 text-white focus:outline-none focus:border-green-500 text-base px-4 py-2 mr-4 mb-4 sm:mb-0"
          name="link"
          placeholder="Add link"
          type="url"
          onChange={(evt) => setLink(evt.target.value)}
          value={link}
          required
        />
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex text-white bg-green-500 border-0 py-2 px-6 focus:outline-none hover:bg-green-600 rounded text-lg"
        >
          {submitting ? "Creating..." : "Create"}
        </button>
      </form>
      <Error message={error} />
    </>
  );
}

export default CreateItem;
