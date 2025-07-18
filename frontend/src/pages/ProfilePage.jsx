import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext);

  const [profilePic, setProfilePic] = useState(null);
  const navigate = useNavigate();
  const [name, setName] = useState(authUser.fullName);
  const [bio, setBio] = useState(authUser.bio);

  const onSubmitHandler = async(e) => {
    e.preventDefault();
    if(!profilePic){
      await updateProfile({fullName: name, bio: bio})
      navigate("/");
      return;
    } 
    const reader = new FileReader();
    reader.readAsDataURL(profilePic);
    reader.onload = async() => {
      const base64Img = reader.result;
      await updateProfile({profilePic: base64Img, fullName: name, bio: bio})
      navigate("/");
    }
  }

  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center">
      <div className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:fleex-col-reverse rounded-lg">
        <form onSubmit={(e) => onSubmitHandler(e)} className="flex flex-col gap-5 p-10 flex-1">
          <h3 className="text-lg">Profile details</h3>
          <label htmlFor="avatar" className="flex items-center gap-3 cursor-pointer">
            <input onChange={(e) => setProfilePic(e.target.files[0])} type="file" id="avatar" accept=".png, .jpf, .jpeg" hidden/>
            <img src={profilePic ? URL.createObjectURL(profilePic) : assets.avatar_icon} alt="" className={`w-12 h-12 ${profilePic && 'rounded-full'}`}/>
            Upload profile image
          </label>
          <input onChange={(e) => setName(e.target.value)} value={name} type="text" className="p-2 border border-gray-500 rounded-md focus:outline-none
          focus:ring-2 focus:ring-violet-500"
          required placeholder="Your name"
          />
          <textarea onChange={(e) => setBio(e.target.value)} className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500" rows={4} required placeholder="write Profile bio"></textarea>
      
          <button type="submit" className="bg-gradient-to-r from-purplle-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer">Save</button>
          
        </form>
        <img className={`max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 ${profilePic && 'rounded-full'}`} src={authUser?.profilePic ||assets.logo_icon} alt=""/>
      </div>
    </div>
  )
}

export default ProfilePage
