package com.thumb.bhochhi;

import java.util.Iterator;
import java.util.LinkedList;
import java.util.Optional;
class Node {
	private String command;
	private String variable;
	private String value;
	private Node next;
	
	public void setCommand(String command) {
		this.command = command;
	}
	
	public void setVariable(String variable){
		this.variable = variable;
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
	
	public String getQuery(String variable){
		 Optional<Node> node = store.stream().filter(n->n.getVariable().equals(variable)).findFirst();
		 return node.isPresent()?node.get().getValue():"l";
	}
	
	public void unSetQuery(String variable){
		Iterator<Node> iterater = store.iterator();
		while(iterater.hasNext()){
			Node node = iterater.next();
			if(node.getVariable().equals(variable)){
				store.remove(node);
				break;
			}
		}		
	}

	public int numEqualTo(String value) {
		Iterator<Node> iterater = store.iterator();
		int count=0;
		while(iterater.hasNext()){
			Node node = iterater.next();
			if(node.getValue().equals(value)){
				count++;
			}
		}		
		return count;		
	}
		
}