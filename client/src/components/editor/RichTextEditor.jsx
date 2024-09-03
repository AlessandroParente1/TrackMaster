import dynamic from "next/dynamic";

// Dynamically import ReactQuill component to ensure it is only loaded on the client side
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false, // Disable server-side rendering for this component
});

// Main component for a rich text editor
const RichTextEditor = ({ content, setContent, disabled = false }) => {
  // Configuration for the toolbar in the editor
  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"], // Formatting options
      ["blockquote", "code-block"], // Blockquote and code block options
      [{ list: "ordered" }, { list: "bullet" }], // Ordered and bullet lists
      [{ header: [1, 2, 3, 4, 5, 6, false] }], // Header options
      [{ color: [] }, { background: [] }], // Text color and background color options
      ["clean"], // Remove formatting option
    ],
  };

  return (
    <ReactQuill
      theme="snow" // Specify the theme for the editor
      value={content} // The current content of the editor
      onChange={setContent} // Handler to update content when it changes
      modules={modules} // Include the toolbar configuration
      readOnly={disabled} // Disable the editor if `disabled` is true
    />
  );
};

export default RichTextEditor;
