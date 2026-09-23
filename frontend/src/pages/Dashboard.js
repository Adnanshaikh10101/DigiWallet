import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function Dashboard() {

    const [documents, setDocuments] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");

    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    // Get documents
    const fetchDocuments = async () => {
        try {

            const response = await axios.get(
                "http://localhost:5000/api/documents/my-documents",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setDocuments(response.data.documents);

        } catch (error) {

            console.error(error);

            setMessage("Failed to load documents");
        }
    };


    // Fetch documents when page loads
    useEffect(() => {
        fetchDocuments();
    });


    // Select file
    const handleFileChange = (e) => {

        const file = e.target.files[0];

        if (file) {
            setSelectedFile(file);
            setMessage("");
        }
    };


    // Upload document
    const handleUpload = async () => {

        if (!selectedFile) {
            setMessage("Please select a file first");
            return;
        }

        const formData = new FormData();

        formData.append(
            "document",
            selectedFile
        );

        try {

            setUploading(true);
            setMessage("");

            await axios.post(
                "http://localhost:5000/api/documents/upload",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            setMessage(
                "Document uploaded successfully!"
            );

            setSelectedFile(null);

            // Clear file input
            document.getElementById(
                "fileInput"
            ).value = "";

            // Refresh documents
            fetchDocuments();

        } catch (error) {

            console.error(error);

            setMessage(
                error.response?.data?.message ||
                "Upload failed"
            );

        } finally {

            setUploading(false);
        }
    };


    // Delete document
    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this document?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            await axios.delete(
                `http://localhost:5000/api/documents/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessage(
                "Document deleted successfully"
            );

            fetchDocuments();

        } catch (error) {

            console.error(error);

            setMessage("Failed to delete document");
        }
    };
    const handleDownload = async (id) => {
    try {

        const response = await axios.get(
            `http://localhost:5000/api/documents/download/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                responseType: "blob"
            }
        );

        const blob = new Blob(
            [response.data]
        );

        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;

        const selectedDocument = documents.find(
            (doc) => doc._id === id
        );

        link.download =
            selectedDocument?.originalName ||
            "document";

        document.body.appendChild(link);

        link.click();

        link.remove();

        window.URL.revokeObjectURL(url);

    } catch (error) {

        console.error(error);

        setMessage(
            "Failed to download document"
        );
    }
};


    return (
        <>
            <Navbar />

            <main className="dashboard">

                {/* Welcome */}

                <section className="dashboard-header">

                    <div>
                        <p className="dashboard-label">
                            YOUR DOCUMENT VAULT
                        </p>

                        <h1>
                            Welcome back, {user?.name} 👋
                        </h1>

                        <p>
                            Store and access your important
                            documents anytime.
                        </p>
                    </div>

                    <div className="document-count">

                        <span>
                            {documents.length}
                        </span>

                        <p>
                            Documents
                        </p>

                    </div>

                </section>


                {/* Upload */}

                <section className="upload-section">

                    <div className="upload-icon">
                        ☁️
                    </div>

                    <h2>
                        Upload a Document
                    </h2>

                    <p>
                        Select a document from your computer
                        to store it securely in the cloud.
                    </p>

                    <div className="file-input-wrapper">

                        <input
                            id="fileInput"
                            type="file"
                            onChange={handleFileChange}
                        />

                    </div>

                    {selectedFile && (
                        <div className="selected-file">

                            📄 {selectedFile.name}

                        </div>
                    )}

                    <button
                        className="upload-btn"
                        onClick={handleUpload}
                        disabled={uploading}
                    >

                        {uploading
                            ? "Uploading..."
                            : "Upload Document"
                        }

                    </button>

                    {message && (
                        <p className="dashboard-message">
                            {message}
                        </p>
                    )}

                </section>


                {/* Documents */}

                <section className="documents-section">

                    <div className="section-heading">

                        <div>
                            <h2>
                                My Documents
                            </h2>

                            <p>
                                Your uploaded files
                            </p>
                        </div>

                    </div>


                    {documents.length === 0 ? (

                        <div className="empty-state">

                            <div>
                                📂
                            </div>

                            <h3>
                                No documents yet
                            </h3>

                            <p>
                                Upload your first document
                                to get started.
                            </p>

                        </div>

                    ) : (

                        <div className="document-list">

                            {documents.map((document) => (

                                <div
                                    className="document-card"
                                    key={document._id}
                                >

                                    <div className="document-info">

                                        <div className="document-icon">
                                            📄
                                        </div>

                                        <div>

                                            <h3>
                                                {document.originalName}
                                            </h3>

                                            <p>
                                                {new Date(
                                                    document.createdAt
                                                ).toLocaleDateString()}
                                            </p>

                                        </div>

                                    </div>


                                    <div className="document-actions">

                                        <button
                                            className="download-btn"
                                            onClick={() => handleDownload(document._id)}>
                                             ⬇ Download
                                        </button>

                                        <button
                                            className="delete-btn"
                                            onClick={() =>
                                                handleDelete(
                                                    document._id
                                                )
                                            }
                                        >
                                            🗑 Delete
                                        </button>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </section>

            </main>
        </>
    );
}

export default Dashboard;