import React from "react";
import ProfileSection from "../../components/ProfileSection";
import NavBarSection from "../../components/NavBarSection";
import TopBar from "../../components/TopBar";
import StoryArea from "../../components/StoryArea";
import PostCreation from "../../components/PostCreation";
import PostList from "../../components/PostList";
import ContactList from "../../components/ContactList";

const HomePage: React.FC = () => {
  return (
    <div className="bg-[#1B2730] flex h-screen overflow-hidden ">
      <div
        className="w-1/5 p-3 flex flex-col overflow-y-auto"
        style={{
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // Internet Explorer and Edge
          overflow: "-moz-scrollbars-none", // Older versions of Firefox
        }}
      >
        <div className="bg-[#010F18] p-2 rounded-md mb-4 ">
          <h1 className="text-2xl text-white font-bold text-center">Tether.</h1>
        </div>
        {/* Render ProfileSection */}
        <ProfileSection />

        {/* Render NavBarSection */}
        <aside className="w-full text-white mt-4 rounded-md">
          <NavBarSection />
        </aside>
      </div>

      <div className="flex-grow flex flex-col ">
        <TopBar />
        <div className="flex p-3 overflow-hidden h-full ">
          <div
            className="my_class flex-grow mr-4 overflow-y-auto  rounded-md"
            style={{
              scrollbarWidth: "none", // Firefox
              msOverflowStyle: "none", // Internet Explorer and Edge
              overflow: "-moz-scrollbars-none", // Older versions of Firefox
            }}
          >
            <StoryArea />
            <PostCreation />
            <PostList />
          </div>
          <ContactList />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
