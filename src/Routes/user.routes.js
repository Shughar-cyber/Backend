
import {Router} from "express";
import { getHome, getAbout, postUser, loginUser, getSingleUser, getAll, deleteUser } from "../controller/user.controllers.js";
import {checkToken} from "../middleware/authmiddleware.js"

const router = Router()

router.get("/", getHome).get("/about", getAbout).post("/signup", postUser).post("/login", loginUser).get("/user/:id", checkToken,getSingleUser).get("/all", checkToken, getAll).delete("/delete/:id", checkToken,deleteUser)

export default router;