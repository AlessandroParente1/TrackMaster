import dynamic from "next/dynamic";

// Dynamically import ReactQuill component to ensure it is only loaded on the client side

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

const RichTextEditor = ({ content, setContent, disabled = false }) => {
  // Configuration for the toolbar in the editor

  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }],
      ["clean"], // Remove formatting option
    ],
  };

  return (
    <ReactQuill
      theme="snow"
      value={content}
      onChange={setContent}
      modules={modules}
      readOnly={disabled}
    />
  );
};

export default RichTextEditor;
