import { faCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { faProjectDiagram, faUpload } from '@fortawesome/free-solid-svg-icons';
import { faFileUpload } from '@fortawesome/free-solid-svg-icons/faFileUpload';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';

const Documents = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile) {
      console.log('Uploading:', selectedFile.name);
    } else {
      alert("Please select a file first.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-8 text-center text-gray-800">
        <FontAwesomeIcon icon={faUpload} /> Upload Required Documents
      </h1>

      <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
        {/* File Upload  */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Select Document
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full border border-gray-300 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
            file:border-0 file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100 rounded-md"
          />
        </div>

        {selectedFile && (
          <p className="text-sm text-gray-600">
            <FontAwesomeIcon className='text-green-400' icon={faCheckCircle} /> Selected File: <span className="font-medium">{selectedFile.name}</span>
          </p>
        )}

        <button
          onClick={handleUpload}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded transition"
        >
          Upload
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">

        {/* Project Documents */}
        <div className="bg-blue-50 p-5 shadow">
          <h3 className="font-semibold text-lg mb-3"><FontAwesomeIcon className='text-yellow-400 pr-3' icon={faProjectDiagram}/> Project Documents</h3>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li><FontAwesomeIcon className='text-blue-800 pr-3' icon={faFileUpload}/> Upload Proposal</li>
            <li><FontAwesomeIcon className='text-blue-800 pr-3' icon={faFileUpload}/> Upload SRS Document</li>
            <li><FontAwesomeIcon className='text-blue-800 pr-3' icon={faFileUpload}/> Upload Signed NDA</li>
            <li><FontAwesomeIcon className='text-blue-800 pr-3' icon={faFileUpload}/> Upload Wireframes/Design</li>
          </ul>
        </div>

        {/* Support Documents */}
        <div className="bg-blue-50 p-5 shadow">
          <h3 className="font-semibold text-lg mb-3"><span className='pr-3'>🛠️</span> Support Documents</h3>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li><FontAwesomeIcon className='text-blue-800 pr-3' icon={faFileUpload}/> Upload Screenshot/Error Log</li>
            <li><FontAwesomeIcon className='text-blue-800 pr-3' icon={faFileUpload}/> Upload Ticket History</li>
            <li><FontAwesomeIcon className='text-blue-800 pr-3' icon={faFileUpload}/> Upload Communication Transcript</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Documents;
