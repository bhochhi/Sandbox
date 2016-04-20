package com.thumb.bhochhi;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

public class CommandInterpreter {
	private Map<String, String> mainStore = new HashMap<String,String>();
	
	private QueryStack queryStack = new QueryStack();
	
	
	
	
	
	private String getNumEqualTo(String value){
		return String.valueOf(mainStore.values().stream().filter(v->v.equals(value)).count());
	}
	
	private void executeBegin() {
	}
	
	public String execute(String commandLine) {
		String[] args = commandLine.split(" ");
		String command = args[0].toUpperCase();
		String result="";
		switch(command){
		case "GET":
			result = mainStore.get(args[1]);
			queryStack.peek(args[1]);
			break;
		case "SET":
			queryStack.push(command, args[1], args[2]);
//			mainStore.compute(args[1],(k,v)->args[2]);
			break;
		case "UNSET":
			queryStack.removeElement(args[1]);
			mainStore.remove(args[1]);
			break;
		case "NUMEQUALTO":			
			result = getNumEqualTo(args[1]);			
			break;
		case "END":
			System.exit(0);
			break;
		case "BEGIN":
			executeBegin();
			break;
		case "ROLLBACK":
			break;
		case "COMMIT":
			break;
		default:
				result = "Invalide Command. Try Again!!";
		
		}
		return result;
		
	}
	
	

}
