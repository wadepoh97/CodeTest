import axios from "axios";
import React, { useEffect, useState } from "react";
import { IUserProfile, DataItem } from "./types";

const API_URL = "http://localhost:8888/api/users";

const getAllProfiles = async (): Promise<IUserProfile[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

const createProfile = async (profile: IUserProfile): Promise<IUserProfile> => {
  const response = await axios.post(`${API_URL}/create-user`, profile);
  return response.data;
};

// Generates a large array of data items for demonstration purposes, do not need to modify.
const generateDataItems = (count: number): DataItem[] => {
  return Array.from({ length: count }, (v, k) => ({
    id: k,
    value: `Item ${k}`,
    number: Math.floor(Math.random() * 100),
  }));
};

const DataTable: React.FC = () => {
  const [dataItems, setDataItems] = useState<DataItem[]>(
    generateDataItems(1000)
  );
  const [searchTerm, setSearchTerm] = useState("");
  
  const processedItems = (() => {
    return dataItems.reduce<DataItem[]>((acc, item) => {
      if (item.value.toLowerCase().includes(searchTerm.toLowerCase())) {
        const newItem = { ...item, number: item.number * 2 };
        return [...acc, newItem];
      }
      return acc;
    }, []);
  })();

  const total = (() => {
    let runningTotal = 0;
    dataItems.reduce((a, b) => (runningTotal += b.number), 0);
    return runningTotal;
  })();

  return (
    <div className="container">
      <input
        type="text"
        placeholder="Filter items..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <table id="tableExample" className="display" style={{ width: 100 }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Value</th>
            <th>Number</th>
          </tr>
        </thead>
        <tbody>
          {processedItems.map((item) => (
            <tr key={Math.random()}>
              <td>{item.id}</td>
              <td>{item.value}</td>
              <td>{item.number}</td>
            </tr>
          ))}
          <tr>
            <td colSpan={2}>Total</td>
            <td>{total}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const UserProfileForm: React.FC = () => {
  const [profile, setProfile] = useState<IUserProfile>({
    name: "",
    email: "",
    age: 0,
    tags: [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createProfile(profile);
    setProfile({ name: "", email: "", age: 0, tags: [] });
  };

  return (
    <div className="container-md">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            onChange={handleChange}
            value={profile.email}
          />
          <div id="emailHelp" className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputName" className="form-label">
            Name
          </label>
          <input
            type="text"
            name="name"
            className="form-control"
            id="exampleInputName"
            value={profile.name}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="exampleInputAge">
            Age
          </label>
          <input
            type="number"
            name="age"
            className="form-control"
            id="exampleInputAge"
            value={profile.age}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="exampleInputTag">
            Tag
          </label>
          <input
            type="text"
            name="tags"
            className="form-control"
            id="exampleInputTags"
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

const UserProfileList: React.FC = () => {
  const [profiles, setProfiles] = useState<IUserProfile[]>([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      const fetchedProfiles = await getAllProfiles();
      setProfiles(fetchedProfiles);
    };

    fetchProfiles();
  }, []);

  return (
    <div>
      <h2>Task 1: User Profiles</h2>
      <ul>
        {profiles.map((profile) => (
          <li key={profile._id}>
            {profile.name} - {profile.email}
            {/* Display tags if present */}
            {profile.tags &&
              profile.tags.map((tag, index) => (
                <span key={index}> {tag} </span>
              ))}
          </li>
        ))}
      </ul>
      <hr />
      <h2>Task 2: Data table</h2>
      <DataTable />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <div>
      <h1>User Profile Management</h1>
      {/* <UserProfileForm /> */}
      {/* <UserProfileList /> */}

      <ul className="nav nav-tabs" id="myTab" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className="nav-link active"
            id="home-tab"
            data-bs-toggle="tab"
            data-bs-target="#home-tab-pane"
            type="button"
            role="tab"
            aria-controls="home-tab-pane"
            aria-selected="true"
          >
            User Profile Form
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="profile-tab"
            data-bs-toggle="tab"
            data-bs-target="#profile-tab-pane"
            type="button"
            role="tab"
            aria-controls="profile-tab-pane"
            aria-selected="false"
          >
            User Profile List
          </button>
        </li>
      </ul>

      <div className="tab-content" id="myTabContent">
        <div
          className="tab-pane fade show active"
          id="home-tab-pane"
          role="tabpanel"
          aria-labelledby="home-tab"
          tabIndex={0}
        >
          <UserProfileForm />
        </div>
        <div
          className="tab-pane fade"
          id="profile-tab-pane"
          role="tabpanel"
          aria-labelledby="profile-tab"
          tabIndex={0}
        >
          <UserProfileList />
        </div>
      </div>
    </div>
  );
};

export default App;
