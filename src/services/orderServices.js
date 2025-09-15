import { apiurl } from "../config/config";
import { getCookie } from "../config/webStorage";
import axios from "axios";

const token = getCookie("zrotoken");
