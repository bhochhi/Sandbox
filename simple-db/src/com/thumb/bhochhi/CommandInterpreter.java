package com.thumb.bhochhi;

import java.util.HashMap;
import java.util.Map;

public class CommandInterpreter {
	private Map<String, String> mainStore = new HashMap<String,String>();
	
	private String getNumEqualTo(String value){
		return String.valueOf(mainStore.values().stream().filter(v->v.equals(value)).count());
	}

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
			result = getNumEqualTo(args[1]);			
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
