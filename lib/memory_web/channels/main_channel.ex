defmodule MemoryWeb.MainChannel do
  use MemoryWeb, :channel
  alias Memory.Game

  def join("main:" <> name, payload, socket) do
    IO.puts("main:" <> name)
    if authorized?(payload) do
      currState = Memory.MemoryBackup.load(name) || Game.load()
      socket = socket |> assign(:currState, currState) |> assign(:name, name)
    

      {:ok, %{"gameState" => currState}, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client

  def handle_in("updates", %{"active1_pos" => active1_pos, "active2_pos" => active2_pos}, socket) do
    currState = socket.assigns[:currState]
     name = socket.assigns[:name]
     gameState  = Game.unmatchedSquares(currState, active1_pos, active2_pos)
    socket = assign(socket, :currState, gameState)
      Memory.MemoryBackup.save(name, gameState)
     {:reply, {:ok, %{ "gameState" => gameState}}, socket}
  end


  def handle_in("reset", %{}, socket) do
     currState = socket.assigns[:currState]
     name = socket.assigns[:name]
     gameState = Game.load()
     socket = assign(socket, :currState, gameState)
     Memory.MemoryBackup.save(name, gameState)
    {:reply, {:ok, %{"gameState" => gameState}}, socket}
  end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (main:lobby).
  def handle_in("onsquareclick", %{"index" => index}, socket) do
     currState = socket.assigns[:currState]
     name = socket.assigns[:name]
     gameState = Game.matchSquares(currState, index)
     socket = assign(socket, :currState, gameState)
     Memory.MemoryBackup.save(name, gameState)
     {:reply, {:ok, %{ "gameState" => gameState}}, socket}
  end


  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
