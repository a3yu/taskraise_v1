import React from "react";

async function ServiceOrderMain({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1>{params.id}</h1>
    </div>
  );
}

export default ServiceOrderMain;
