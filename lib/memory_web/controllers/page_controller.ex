defmodule MemoryWeb.PageController do
  use MemoryWeb, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
  
  def memory(conn, params) do
    render conn, "memory.html", memory: params["memory"]
  end

end
