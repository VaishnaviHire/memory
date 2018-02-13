defmodule Memory.Game do

 def load() do 
  	grid = ["A", "A","B","B","C","C","D","D","E","E","F","F","G","G","H","H"]
  	%{
    	  startGrid: Enum.shuffle(grid),
    	  active: ["?","?","?", "?","?","?","?","?","?","?","?","?","?","?","?","?"],
    	  active1: "None",
    	  active1_pos: "",
    	  active2: "None",
    	  active2_pos: "",
    	  clicks: 0,
    	  score: 0
   	}
 end



 def show(prev, index, letter) do
	startGridList = prev.startGrid                                                 
  	activeList =  prev.active
  	active1 = prev.active1
  	active1_pos = prev.active1_pos
  	active2 = prev.active2
  	active2_pos = prev.active2_pos
  	clicks = prev.clicks
  	score = prev.score
  
  	active_square = Enum.at(startGridList, index)

  	{active1, active1_pos, active2, active2_pos, clicks, score} = cond do

  	active1 == "None" -> {active_square, index, "None", "", clicks + 1, score }

  	active1 != "None" and active2 == "None" and index == active1_pos 
		-> {active_square, index,"None", "", clicks, score}

   	active1 != "None" and active2 == "None" and active_square == active1 
		-> {active1, active1_pos, active_square, index, clicks + 1, score + 5}

   	active2 == "None" -> {active1, active1_pos,active_square, index, clicks, score - 1}

  	active1 != "None" and active2 != "None" and index == active2_pos 
		-> {active1, active1_pos, active_square, index, clicks , score }

   	true -> {active_square, index, "None", "", clicks + 1, score }
  
	end

 	activeList = List.replace_at(activeList, index, active_square)
 	Map.merge(prev, %{active: activeList, active1: active1, active1_pos: active1_pos, 
		active2: active2, active2_pos: active2_pos, clicks: clicks, score: score})
 end

 def checks(prev, active1, active2, active1_pos, active2_pos) do
	activeList = prev.active
	activeList = List.replace_at(activeList, active1_pos, "?")
	activeList = List.replace_at(activeList, active2_pos, "?")
	{active1, active1_pos, active2, active2_pos} = {"None", "","None", ""}

	Map.merge(prev, %{active: activeList, active1: active1, active2: active2, active1_pos: active1_pos, active2_pos: active2_pos })
 end 


end
