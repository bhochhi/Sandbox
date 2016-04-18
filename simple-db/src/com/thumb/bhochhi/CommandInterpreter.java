package com.thumb.bhochhi;

import java.util.HashMap;
import java.util.Map;

public class CommandInterpreter {
	private Map<String, String> mainStore = new HashMap<String,String>();

	public String execute(String commandLine) throws ArrayIndexOutOfBoundsException, Exception{
		String[] args = commandLine.split(" ");
		String command = args[0].toUpperCase();
		String result="";
		switch(command){
		case "GET":
			result = mainStore.get(args[1]);
			break;
		case "SET":
			mainStore.compute(args[1],(k,v)->args[2]);
			break;
		case "UNSET":
			mainStore.remove(args[1]);
			break;
		case "NUMEQUALTO":			
			result = String.valueOf(mainStore.values().stream().filter(v->v==args[1]).count());			
			break;
		case "END":
			System.exit(0);
			break;
		default:
				result = "Invalide Command. Try Again!!";
		
		}
		return result;
		
	}
	
	

}
