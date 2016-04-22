package com.thumb.bhochhi;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedList;

public class QueryStack {

	private LinkedList<Node> store = new LinkedList<Node>();

	private boolean isBeginNode(Node node) {
		return node.getCommand().equals("BEGIN");
	}

	private boolean isCommitNode(Node node) {
		return node.getCommand().equals("COMMIT");
	}

	private boolean isUnSetNode(Node node) {
		return node.getCommand().equals("UNSET");
	}

	// O(1)
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

	private boolean variableIsUnset(Node node, String variable) {
		return isUnSetNode(node) && node.getVariable().equals(variable);
	}
    
	// O(n)
	public String getQuery(String variable) {
		Iterator<Node> itr = store.iterator();
		while (itr.hasNext()) {
			Node node = itr.next();

			if (nodeIsBelongstoTransaction(node)) {
				continue;
			}

			if (variableIsUnset(node, variable) || nodeIsBelongstoTransaction(node)) {
				return null;
			}

			if (node.getVariable().equals(variable)) {
				return node.getValue();
			}

		}
		return null;
	}

	private boolean nodeIsBelongstoTransaction(Node node) {
		return isBeginNode(node) || isCommitNode(node);
	}
    
	//O(1)
	public void unSetQuery(String command, String variable) {
		Node node = new Node() {
			{
				setCommand(command);
				setVariable(variable);
			}
		};
		store.addFirst(node);
	}
  
	//O(n), can be improved a lot better by keeping separate structure(HashMap) for this operation(O(1))
	public int numEqualTo(String value) {

		ArrayList<String> unSetVariables = new ArrayList<String>();
		ArrayList<String> matchedVariables = new ArrayList<String>();
		Iterator<Node> iterater = store.iterator();
		while (iterater.hasNext()) {
			Node node = iterater.next();
			if (isUnSetNode(node) && !matchedVariables.contains(node.getVariable())) {
				unSetVariables.add(node.getVariable());
			} else if (!isUnSetNode(node) && !isBeginNode(node) && !isCommitNode(node)
					&& !unSetVariables.contains(node.getVariable()) && !matchedVariables.contains(node.getVariable())
					&& node.getValue().equals(value)) {
				matchedVariables.add(node.getVariable());
			}
		}
		return matchedVariables.size();
	}

	//O(1)
	public void beginTransaction(String command) {
		Node node = new Node() {
			{
				setCommand(command);
			}
		};
		store.addFirst(node);
	}

	//O(n)
	public String commitTransaction(String command) {
		int index = getBeginNodeIndex();		
		if (index == -1) {
			return "NO TRANSACTION";
		}else{			
			Node node = new Node() {{ setCommand(command); }};
			store.addFirst(node);
			return "";
		}
	}

	//O(n)
	private int getBeginNodeIndex() {
		for (int i = 0; i < store.size(); i++) {
			Node node = store.get(i);
			if (node.getCommand().equals("COMMIT")) {				
				return -1;
			} else if (node.getCommand().equals("BEGIN")) {
				return i;
			}
		}
		return -1;
	}
    
	//O(n)
	public String rollbackQuery(String command) {
		int idx = getBeginNodeIndex();
		if (idx == -1) {
			return "NO TRANSACTION";
		} else {
			while (idx > -1) {
				store.remove(idx--);
			}
			return "";
		}
	}
}

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