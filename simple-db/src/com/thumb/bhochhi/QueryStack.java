package com.thumb.bhochhi;

import java.util.LinkedList;

public class QueryStack extends LinkedList<Node>{

	private Node first;
	private int nodeCount;

	class Node {
		private String command;
		private String variable;
		private String value;
		private Node next;
	}

	public void push(String command,String variable,String value){
		Node oldNode = first;
		first = new Node();
		first.command=command;
		first.variable=variable;
		first.value = value;
		first.next=oldNode;
		nodeCount++;
		
	}
	
	public boolean isEmpty(){
		return first==null;
	}
	
	
	public void removeElement(String variable){
		
	}
	public String pop(){
		first = first.next;
		nodeCount--;
		return first.value;
	}
	
	public String peek(String variable){
		
		return null;
	}
	
	public int size(){
		return nodeCount;
	}
	
}
