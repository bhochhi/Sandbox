package com.thumb.bhochhi;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.Optional;
class Node {
	private String command;
	private String variable;
	private String value;
	
	public void setCommand(String command) {
		this.command = command;
	}
	public String getCommand(){
		return command;
	}
	
	public void setVariable(String variable){
		this.variable =  variable;
	}
	public String getVariable(){
		return variable;
	}
	public void setValue(String value){
		this.value = value;
	}
	public String getValue(){
		return value;
	}	
}
public class QueryStack{

	private LinkedList<Node> store = new LinkedList<Node>();	
	
	public void setQuery(String command,String variable, String value){
		Node node = new Node(){{
			setCommand(command);
			setVariable(variable);
			setValue(value);
		}};
		store.addFirst(node);				
	}
	private boolean isBiginNode(Node node){
		return node.getCommand().equals("BEGIN");
	}
	private boolean isUnSetNode(Node node){
		return node.getCommand().equals("UNSET");
	}
	public String getQuery(String variable){
		 Optional<Node> node = store.stream().filter(n-> !isBiginNode(n) && n.getVariable().equals(variable)).findFirst();
		
		 return node.isPresent() && !isUnSetNode(node.get())?node.get().getValue():null;
	}
	
	public void unSetQuery(String command,String variable){
		Node node = new Node(){{
			setCommand(command);
			setVariable(variable);
		}};
		store.addFirst(node);		
	}

	public int numEqualTo(String value) {
		ArrayList<String> unSetVariables = new ArrayList<String>();
		ArrayList<String> matchedVariables = new ArrayList<String>();
		Iterator<Node> iterater = store.iterator();
		int count=0;
		while(iterater.hasNext()){
			Node node = iterater.next();
			if(isUnSetNode(node) && !matchedVariables.contains(node.getVariable())){
					unSetVariables.add(node.getVariable());
			}
			else if(!isUnSetNode(node) && !isBiginNode(node) && !matchedVariables.contains(node.getVariable()) && node.getValue().equals(value)){
				matchedVariables.add(node.getVariable());
			}
		}		
		return matchedVariables.size();		
	}

	public void beginTransaction(String command) {
		Node node = new Node(){{
			setCommand(command);
		}};
		store.addFirst(node);		
	}

	public String rollbackQuery(String command) {
		Iterator<Node> iterater = store.iterator();
		
		while(iterater.hasNext()){
			Node node = iterater.next();
			if(node.getCommand().equals(command)){
				System.out.println("begin node "+node);
				
				break;
			}
		}		
		System.out.println(iterater.next());
		return "";
	}
		
}