package com.thumb.bhochhi;

public class QueryInterpreter {

	private QueryStack queryStack = new QueryStack();

	public String execute(String commandLine) {
		try {

			String[] args = commandLine.split(" ");
			String command = args[0].toUpperCase();
			String result = "";
			switch (command) {
			case "GET":
				result = queryStack.getQuery(args[1]);
				break;
			case "SET":
				queryStack.setQuery(command, args[1], args[2]);
				break;
			case "UNSET":
				queryStack.unSetQuery(command, args[1]);
				break;
			case "NUMEQUALTO":
				result = String.valueOf(queryStack.numEqualTo(args[1]));
				break;
			case "END":
				result = "END";
				break;
			case "BEGIN":
				queryStack.beginTransaction(command);
				break;
			case "ROLLBACK":
				result = queryStack.rollbackQuery(command);
				break;
			case "COMMIT":
				queryStack.commitTransaction(command);
				break;
			default:
				result = "Invalid Query. Try Again!!";

			}
			return result;

		} catch (ArrayIndexOutOfBoundsException e) {
			return "Invalid Query. Try Again!!";
		}
	}

}
