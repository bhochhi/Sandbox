package com.thumb.bhochhi;

public class QueryInterpreter {
	
	private QueryStack queryStack = new QueryStack();
	
	
	public String execute(String commandLine) {
		try{
			
		
		String[] args = commandLine.split(" ");
		String command = args[0].toUpperCase();
		String result="";
		switch(command){
		case "GET":
			result = queryStack.getQuery(args[1]);
			break;
		case "SET":
			queryStack.setQuery(command, args[1], args[2]);
			break;
		case "UNSET":
			queryStack.unSetQuery(args[1]);
			break;
		case "NUMEQUALTO":			
			result = String.valueOf(queryStack.numEqualTo(args[1]));
			break;
		case "END":
			result = "END";
			break;
		case "BEGIN":
			
			break;
		case "ROLLBACK":
			break;
		case "COMMIT":
			break;
		default:
				result = "Invalid Command. Try Again!!";
		
		}
		return result;
		
		}catch(ArrayIndexOutOfBoundsException e){
			return "Invalid COmmand. Try Again!!";
		}
	}
	
	
	

}
