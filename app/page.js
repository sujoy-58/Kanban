import React from "react";
import { redirect } from 'next/navigation';


export default function Home() {
  // This will redirect to the /daily page
  redirect('/Daily');
}
