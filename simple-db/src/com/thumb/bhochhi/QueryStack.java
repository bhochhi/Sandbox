package com.thumb.bhochhi;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

class Node {
	private String command;
	private String variable;
	private String value;

	public void setCommand(String command) {
		this.command = command;
	}

	public String getCommand() {
		return command;
	}

	public void setVariable(String variable) {
		this.variable = variable;
	}

	public String getVariable() {
		return variable;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public String getValue() {
		return value;
	}

	public String toString() {
		return command + "  " + variable + " " + value;
	}
}

public class QueryStack {

	private LinkedList<Node> store = new LinkedList<Node>();

	public void setQuery(String command, String variable, String value) {
		Node node = new Node() {
			{
				setCommand(command);
				setVariable(variable);
				setValue(value);
			}
		};
		store.addFirst(node);
	}

	private boolean isBiginNode(Node node) {
		return node.getCommand().equals("BEGIN");
	}

	private boolean isUnSetNode(Node node) {
		return node.getCommand().equals("UNSET");
	}

	public String getQuery(String variable) {
		Optional<Node> node = store.stream().filter(n -> !isBiginNode(n) && n.getVariable().equals(variable))
				.findFirst();

		return node.isPresent() && !isUnSetNode(node.get()) ? node.get().getValue() : null;
	}

	public void unSetQuery(String command, String variable) {
		Node node = new Node() {
			{
				setCommand(command);
				setVariable(variable);
			}
		};
		store.addFirst(node);
	}

	public int numEqualTo(String value) {
		ArrayList<String> unSetVariables = new ArrayList<String>();
		ArrayList<String> matchedVariables = new ArrayList<String>();
		Iterator<Node> iterater = store.iterator();
		while (iterater.hasNext()) {
			Node node = iterater.next();
			if (isUnSetNode(node) && !matchedVariables.contains(node.getVariable())) {
				unSetVariables.add(node.getVariable());
			} else if (!isUnSetNode(node) && !isBiginNode(node) && !unSetVariables.contains(node.getVariable())
					&& !matchedVariables.contains(node.getVariable()) && node.getValue().equals(value)) {
				matchedVariables.add(node.getVariable());
			}
		}
		return matchedVariables.size();
	}

	public void beginTransaction(String command) {
		Node node = new Node() {
			{
				setCommand(command);
			}
		};
		store.addFirst(node);
	}

	private Node getBeginNode() {
		
		return store.stream().filter(n -> n.getCommand().equals("BEGIN")).findFirst().orElse(null);
	}

	public String rollbackQuery(String command) {
		Node beginNode = getBeginNode();
		int idx = store.indexOf(beginNode);
		
		if (beginNode == null) {
			return "NO TRANSACTION";
		} else {
			while (true) {
//				 Node node = store.peekFirst();
//				 if(node)
//				 if(node.getCommand().equals("BEGIN")){
//				 break;
//				 }
			}
		}
	}
}