import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios.js";
import { uploadToCloudinary } from "../api/upload.js";

export default function CourseEditor() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [sectionTitle, setSectionTitle] = useState("");
  const [lectureForms, setLectureForms] = useState({}); // sectionId -> {title, file, uploading}

  const load = async () => {
    const { data } = await api.get("/courses/mine");
    setCourse(data.courses.find((c) => c._id === id));
  };
  useEffect(() => { load(); }, [id]);

  const addSection = async (e) => {
    e.preventDefault();
    await api.post(`/courses/${id}/sections`, { title: sectionTitle });
    setSectionTitle("");
    load();
  };

  const setLectureField = (sectionId, field, value) => {
    setLectureForms((prev) => ({ ...prev, [sectionId]: { ...prev[sectionId], [field]: value } }));
  };

  const addLecture = async (sectionId) => {
    const form = lectureForms[sectionId];
    if (!form?.title || !form?.file) return;
    setLectureField(sectionId, "uploading", true);
    try {
      const videoUrl = await uploadToCloudinary(form.file, { resourceType: "video" });
      await api.post(`/courses/${id}/sections/${sectionId}/lectures`, {
        title: form.title,
        videoUrl
      });
      setLectureForms((prev) => ({ ...prev, [sectionId]: { title: "", file: null, uploading: false } }));
      load();
    } catch (err) {
      alert("Upload failed: " + err.message);
      setLectureField(sectionId, "uploading", false);
    }
  };

  const togglePublish = async () => {
    await api.patch(`/courses/${id}/publish`, { isPublished: !course.isPublished });
    load();
  };

  if (!course) return <div className="p-14 text-center text-forest-700/70">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-14">
      <Link to="/instructor" className="text-sm text-forest-700/70 hover:text-forest-600">&larr; Back to dashboard</Link>
      <div className="flex items-center justify-between mt-3">
        <h1 className="font-display text-3xl text-forest-900">{course.title}</h1>
        <button
          onClick={togglePublish}
          className={`text-sm px-4 py-2 rounded-full ${
            course.isPublished ? "bg-gray-100 text-gray-600" : "bg-forest-800 text-white"
          }`}
        >
          {course.isPublished ? "Unpublish" : "Publish"}
        </button>
      </div>

      <form onSubmit={addSection} className="flex gap-3 mt-8">
        <input
          className="border border-moss-200 p-3 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-forest-500"
          placeholder="New section title"
          value={sectionTitle}
          onChange={(e) => setSectionTitle(e.target.value)}
        />
        <button className="bg-forest-800 text-white px-5 rounded-full hover:bg-forest-700">Add section</button>
      </form>

      <div className="mt-8 space-y-4">
        {course.sections.map((s) => (
          <div key={s._id} className="bg-white border border-moss-200 rounded-xl p-4">
            <h3 className="font-medium text-forest-900">{s.title}</h3>
            <ul className="mt-2 space-y-1">
              {s.lectures.map((l) => (
                <li key={l._id} className="text-sm text-forest-700/80">&bull; {l.title}</li>
              ))}
            </ul>

            <div className="mt-3 border-t border-moss-200 pt-3 flex flex-wrap gap-2 items-center">
              <input
                className="border border-moss-200 p-2 rounded-lg text-sm flex-1 min-w-[140px]"
                placeholder="Lecture title"
                value={lectureForms[s._id]?.title || ""}
                onChange={(e) => setLectureField(s._id, "title", e.target.value)}
              />
              <input
                type="file"
                accept="video/*"
                className="text-sm"
                onChange={(e) => setLectureField(s._id, "file", e.target.files[0])}
              />
              <button
                onClick={() => addLecture(s._id)}
                disabled={lectureForms[s._id]?.uploading}
                className="bg-forest-700 text-white px-4 py-2 rounded-full text-sm hover:bg-forest-600 disabled:opacity-50"
              >
                {lectureForms[s._id]?.uploading ? "Uploading..." : "Add lecture"}
              </button>
            </div>
          </div>
        ))}
        {course.sections.length === 0 && (
          <p className="text-forest-700/70 text-center py-8">Add your first section above.</p>
        )}
      </div>
    </div>
  );
}
