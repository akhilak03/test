import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { BiLogIn } from "react-icons/bi";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  //state for image
  let [img,setImg]=useState(null);
  //on img selecct
  const onImageSelect=(event)=>{
    console.log(event); 
    setImg(event.target.files[0]);
    //setFile(event.target.files[0])
    //console.log(event.target.files[0]);
     
  }
  const onFormSubmit = (userobj) => { 
    let formData=new FormData();
    formData.append("userObj",JSON.stringify(userobj));
    formData.append("photo",img)
    axios
      .post("http://localhost:4000/user/create-user", formData)
      .then((response) => { 
        //console.log(response)
        alert(response.data.message);
        if (response.data.message === "new user Created!!") {
          navigate("/login");
        } 
      })
      .catch((error) => alert("something went wrong in creating user"));
  };
  const navigate = useNavigate();
  return (
    <div>
      <div className="display-2 text-center text-secondary m-3">
        SignUp Form
      </div>
      <Form className="w-50 mx-auto" onSubmit={handleSubmit(onFormSubmit)}>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="enter Username"
            {...register("username", { required: true })}
          />
          {/*error validation for username */}
          {errors.username && (
            <p className="text-danger"> *username is required</p>
          )}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="enter Password"
            {...register("password", { required: true })}
          />
          {errors.password && (
            <p className="text-danger"> *password is required</p>
          )}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="text"
            placeholder="enter Email"
            {...register("email", { required: true })}
          />
          {errors.email && <p className="text-danger"> *Email is required</p>}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>City</Form.Label>
          <Form.Control
            type="text"
            placeholder="enter City"
            {...register("city", { required: true })}
          />
          {errors.city && <p className="text-danger"> *city is required</p>}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>select image</Form.Label>
          <Form.Control
            type="file"
            {...register("photo", { required: true })}
            onChange={(event)=>onImageSelect(event)}
          />
          {errors.photo && <p className="text-danger"> *photo is required</p>}
        </Form.Group>


        <Button variant="primary" type="submit">
          SignIn <BiLogIn />
        </Button>
      </Form>
    </div>
  );
}

export default Signup;
